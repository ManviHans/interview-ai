import "../auth.form.scss"
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {

    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const [ error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const success = await handleLogin({ email, password });
        if (success) {
            navigate("/");
        } else {
            setError("Invalid email or password. Please try again.");
        }
    }

    if(loading){
        return (<main>
            <h1>Loading....</h1>
        </main>)
    }
    return (
        <main>

            <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit} >
                {error && <p role="alert">{error}</p>}
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder="Enter your email" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder="Enter your password" />
                </div>

                <button className="button primary-button">Login</button>
            </form>

            <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
