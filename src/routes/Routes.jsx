import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "../pages/home/Home";
import StoryParticipate from "../pages/StoryParticipate/StoryParticipate";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";

export default function AppRoutes () {
    return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/participate" element={<StoryParticipate />} />
          </Routes>  
    )
  
}