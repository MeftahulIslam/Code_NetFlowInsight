from flask import Blueprint,render_template, request, flash, redirect, url_for
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
import os, random

# Creating a Blueprint named 'auth'
auth = Blueprint('auth', __name__)

# Route for user signup
@auth.route("/signup", methods=['GET', 'POST'])
def signup():
    # Handling the form submission for user signup
    if request.method == 'POST':
        # Retrieving form data
        email = request.form.get('email')
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        api_key = request.form.get('api_key')
        
        # Checking for existing user with the same email
        user_exists = User.query.filter_by(email=email).first()

        # Validation checks for user input
        if len(email) < 4:
            flash('Incorrect email format.', category='error')
        elif len(firstname) < 2: 
            flash('Firstname must be longer than a character', category='error')
        elif len(lastname) < 2:
            flash('Lastname must be longer than a character', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match', category='error')
        elif len(password1) < 7: 
            flash('Password must be longer than 8 characters', category='error')
        elif user_exists:
            flash('A user with the email already exists! Please choose another email.', category='error')
        else:
            try:
                # Creating a unique user identifier 
                user = firstname + "_" + str(random.random())
                # Creating a unique directory for each user's files
                base_directory = os.path.abspath('/opt/uploads/Files')
                user_directory = os.path.join(base_directory, user)
                if not os.path.exists(user_directory):
                    os.makedirs(user_directory)
                
                # Creating a new user object and adding it to the database
                new_user = User(email=email, firstname=firstname, lastname=lastname, 
                                password=generate_password_hash(password1, method='pbkdf2:sha256'),
                                path=user_directory, api_key=api_key)
                db.session.add(new_user)
                db.session.commit()

                # Flash message for successful account creation
                flash('Account created successfully!', category='success')
                return redirect(url_for('auth.login'))  # Redirecting to login page after successful signup

            except Exception as e:
                flash(f'{e}', category='error')

    return render_template("signup.html", user=current_user)

# Route for user login
@auth.route("/login", methods=['GET', 'POST'])
def login():
    # Handling the form submission for user login
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Querying the database for the user with the provided email
        user = User.query.filter_by(email=email).first()

        # Validating user credentials
        if user and check_password_hash(user.password, password):
            # Flash message for successful login
            flash('Logged in successfully!', category='success')
            login_user(user, remember=True)  # Logging in the user
            return redirect(url_for('views.home', user=current_user))  # Redirecting to the home page after login
        else:
            flash('Username or password incorrect!', category='error')
            return render_template("login.html", email=f"{email}", user=current_user)

    return render_template("login.html", user=current_user)  

# Route for user logout
@auth.route("logout/")
@login_required 
def logout():
    logout_user()  
    return redirect(url_for('auth.login')) 