import React, { Component } from 'react';

var firebase = require('firebase');

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

class Authen extends Component {

  signup(event){
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const auth = firebase.auth()
    const promise = auth.createUserWithEmailAndPassword(email, password)

    promise
    .then(user => {
      var userRef = firebase.database().ref();
      userRef.child('users/' + user.user.uid).set({
        email: email,
      })
      console.log(`This is user uid ${user.uid}`)
      console.log(user)

      // removing error message
      var erMsg = document.getElementById('error')
      erMsg.className = 'hide'

      var print = document.getElementById('printMsg')
      print.className = 'welmsg'
      var msg = "Welcome " + email + " and please log in.";
      this.setState({msg: msg});
    })

    promise
    .catch(e => {
      var printError = document.getElementById('error')
      printError.className = 'welmsg'
      var err = e.message;
      this.setState({err: err});
    })
  }

  login(event){
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    console.log(email)
    console.log(password)

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password)
    console.log(`Type of promise is ${typeof(promise)}`)
    console.log("The promise is: ")
    console.log(promise)

    // Todo handle login promise
    promise.then(user => {

      // removing error message
      var erMsg = document.getElementById('error')
      erMsg.className = 'hide'

      // removing buttons
      var lout = document.getElementById('logout');
      lout.classList.remove('hide');

      var lin = document.getElementById('login')
      lin.className = 'hide'

      var sup = document.getElementById('signup')
      sup.className = 'hide'

      var sinGoogle = document.getElementById('googleSignIn')
      sinGoogle.className = 'hide'

      var print = document.getElementById('printMsg')
      print.className = 'welmsg'
      var msg = "Welcome user, your email id is " + email;

      this.setState({msg: msg})
    })

    promise.catch(e => {
      var printError = document.getElementById('error')
      printError.className = 'welmsg'
      var err = e.message;
      console.log(err);
      this.setState({err: err})
    })

  }

// Sign in with Google
  googleSignIn(){
    console.log("I am from google sign in method.")

    var provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      var user = result.user

      firebase.database().ref('users/'+user.uid).set({
        email: user.email,
        name: user.displayName,
      })

      var lout = document.getElementById('logout');
      lout.classList.remove('hide');

      var lin = document.getElementById('login')
      lin.className = 'hide'

      var sup = document.getElementById('signup')
      sup.className = 'hide'

      var sinGoogle = document.getElementById('googleSignIn')
      sinGoogle.className = 'hide'

      var print = document.getElementById('printMsg')
      print.className = 'welmsg'
      var msg = `Welcome ${user.displayName}, your email id is ${user.email}`;

      this.setState({msg: msg})

    })
    .catch(error => {
      var errorMessage = error.message;
      console.log(errorMessage)
      var er = document.getElementById('error')
      er.className = 'welmsg'
      this.setState({err: errorMessage})
    })
  }

  logout(event){
    var auth = firebase.auth()
    auth.signOut()

    .then(user=>{

      var lout = document.getElementById('logout')
      lout.className = 'hide';

      var lin = document.getElementById('login');
      lin.classList.remove('hide');

      var sup = document.getElementById('signup');
      sup.classList.remove('hide');

      var sinGoogle = document.getElementById('googleSignIn');
      sinGoogle.classList.remove('hide');

      var print = document.getElementById('printMsg')
      print.className = 'welmsg'

      var msg = "Thanks for using my app. You've been successfully logged out."
      this.setState({msg: msg})

      // To refresh page after logout in 10 seconds
      setInterval('window.location.reload()', 10000);
    })

    .catch(e => {
      var printError = document.getElementById('error')
      printError.className = 'welmsg'
      var err = e.message
      this.setState({err: err})
    })
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      msg: '',
    };
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
    this.logout = this.logout.bind(this)
    this.googleSignIn = this.googleSignIn.bind(this)
  }

  render(){
    return(
      <div>
        <input id="email" ref="email" type="email" placeholder="Enter your email"/><br/>
        <input id="pass" ref="password" type="password" placeholder="Enter your password"/><br/>
        <p id='error'>{this.state.err}</p><br/>
        <p id='printMsg'>{this.state.msg}</p><br/>
        <button id="login" onClick={this.login}>Log In</button>
        <button id="signup" onClick={this.signup}>Sign Up</button>
        <button id="logout" className="hide" onClick={this.logout}>Log Out</button>
        <button id="googleSignIn" onClick = {this.googleSignIn} >Sign In with Google</button>
      </div>
    );
  }
}

export default Authen;
