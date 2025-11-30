import { useEffect, useState,useRef} from "react";
import { Routes, Route,useNavigate  } from "react-router-dom";
import axios from "axios";

const USER_API_URL = "http://localhost:5000/api/user";

export class UserControler {
    static LoginControl = class{
        constructor(username,password,token){
            this.username = username;
            this.password = password;
        }
        handleLogin = async () => {
            try {
              const res = await fetch('http://localhost:5000/api/user/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: this.username, password: this.password }),
              });
                const data = await res.json();
                if(data.success){
                    localStorage.setItem('token', data.token);
                    return data;
                    
                }
                else{
                    throw new Error(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        }
        handleLogout = () => {
            localStorage.removeItem('token');
            window.location.href = '/';
            this.username = "";
            this.password = "";
        }

    };
}