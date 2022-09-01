import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { changeToken } from "../features/userSlice";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeToken(''));
    navigate('../login');
  })

  return (
    <>
    Login out...
    </>
  )
} 