import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function CatsComponent() {
  const { token } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  if(token === '') {
    navigate('../login');
  };

  
}