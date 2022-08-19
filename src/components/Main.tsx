import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinnner";
import Navbar from "./Navbar";
import '../styles/Main.css';
import Map from "./Map";

export function Main() {
  return (
    <p>main</p>
  )
}