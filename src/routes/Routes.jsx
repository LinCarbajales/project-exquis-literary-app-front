import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "../pages/home/Home";
import StoryParticipate from "../pages/StoryParticipate/StoryParticipate";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import UserArea from "../pages/userArea/UserArea";

export default function AppRoutes () {
    return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userarea" element={<UserArea />} />
          <Route path="/participate" element={<StoryParticipate />} />
          </Routes>  
    )
  
}