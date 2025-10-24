import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "../pages/home/Home";
import CollaboratePage from "../pages/collaboratePage/collaboratePage";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import UserArea from "../pages/userArea/UserArea";
import StoriesPage from "../pages/storiesPage/StoriesPage";
import StoryDetailPage from '../pages/storyDetailPage/StoryDetailPage';

export default function AppRoutes () {
    return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userarea" element={<UserArea />} />
          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
        </Routes>  
    )
  
}