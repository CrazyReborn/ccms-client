import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinnner";
import Navbar from "./Navbar";
import '../styles/Main.css';
import Map from "./Map";
import ColoniesMini from "./ColoniesMini";
import UsersMini from "./UsersMini";

export function Main() {
  return (
    <div className='main'>
      <Map />
      <div className="bottom-container">
        <UsersMini />
        <ColoniesMini />
      </div>
    </div>
  )
}