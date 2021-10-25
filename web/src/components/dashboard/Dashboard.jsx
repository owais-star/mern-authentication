import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/Context";
import axios from "axios";
import Message from "../message/Message";
import { baseUrl } from "../../core"
import PrimarySearchAppBar from "./Appbar"
import "./dashboard.css"


function Dashboar() {
  let { state, dispatch } = useContext(GlobalContext);
  const activeSlideRef = useRef(null);


  function logout() {
    dispatch({
      type: "USER_LOGOUT",
      payload: null
    })
  }

  return (
    <>
    <PrimarySearchAppBar />
    </>
  );
}

export default Dashboar;