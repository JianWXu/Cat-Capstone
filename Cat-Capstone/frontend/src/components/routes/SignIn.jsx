import React, {useState, useContext} from "react";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom"
// import UserContext from "./userContext";
import "../../css/signin.css"


function AppLogin(props){
    const {authLoginInfo, shouldShowLogin} = props
    const navigate = useNavigate()
    const INITIAL_STATE = {
        email: "",
        password: ""
    } 
    const [formData, setFormData] = useState(INITIAL_STATE)
    

    const handleChange = e => {
            const {name, value} = e.target
            setFormData(data =>({
                ...data,
                [name]: value
            }))
    }

    const handleSubmit = async e => {
            e.preventDefault()
            try{
                await authLoginInfo({...formData})            
                navigate("/")
                console.log("Login successful. Navigating to '/'...")
            }catch(err){
                console.error("Error logging in", err);
                setErrorMessage("Incorrect email or password.");
                console.log("Login unsuccessful.")
            }   
    }


    return (
        <>
        <br/>

        {shouldShowLogin && (

            <div className="signInFormDiv">
            
            <h6>Sign In</h6>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="emailLabel">Email: </label>
                <br/>
                <input
                id="email"
                type="text"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                />
                <br />
                <label htmlFor="password" className="passwordLabel">Password: </label>
                <br />
                <input
                id="password"
                type="text"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                />
                <br />
                <button className="signinSubmitButton">Submit</button>
            </form>
        
        
        </div>
)}
        </>
        )
    }

export default AppLogin