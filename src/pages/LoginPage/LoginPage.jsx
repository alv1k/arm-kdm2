import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideNavbar } from '../../store/navbarSlice';
import { setType, selectedType, isShowDetails, showDetails, setTab, selectedTab } from '../../store/agreementsSlice';
import useMediaQueries from '../../hooks/useMediaQueries';

import Header from '../../components/TheHeader/TheHeader';
import TheNavbar from '../../components/TheNavbar/TheNavbar';
import AgreementItem from '../../components/TheAgreementItem/TheAgreementItem';
import TheTabsComponent from '../../components/TheTabsComponent/TheTabsComponent';


const LoginPage = () => {  
  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate('/settings')
  // }
  const showNavbar = useSelector(state => state.navbar.showNavbar);
  const agreementType = useSelector(selectedType);
  const showAgreementDetails = useSelector(isShowDetails);
  const agreementTab = useSelector(selectedTab);
  
  const { xl_breakpoint, lg_breakpoint, md_breakpoint, sm_breakpoint } = useMediaQueries();
  let agreements = [
    {
      name: 'agree1',
      summ: 400000,
      date: new Date(2025, 5, 6).toLocaleDateString(), // Преобразуем дату в строку
      address: 'г. Якутск, ул. Ленина 123, 1 этаж, каб. №123',
      num: 'num123'
    },
    {
      name: 'agree2',
      summ: 250000,
      date: new Date(2025, 7, 15).toLocaleDateString(),
      address: 'г. Москва, ул. Пушкина 10',
      num: 'num456'
    },
  ]
  const dispatch = useDispatch();
  const sideClick = (event) => {
    event.stopPropagation();
    dispatch(hideNavbar());
  };
  
  const [filteredAgreements, setFilteredAgreements] = useState(agreements);
  const handleAgreementClick = (data) => {
    dispatch(showDetails(data));
    const newFilteredAgreements = agreements.filter(agreement => agreement.num === data.num);
    setFilteredAgreements(newFilteredAgreements);
    console.log(newFilteredAgreements, 'check5');
  };


  return (
    <div>
      <img src="./src/assets/temp/login.png" alt="" />
    </div>
  )
}
export default LoginPage;