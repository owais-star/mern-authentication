import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/Context";
import axios from "axios";
import Message from "../message/Message";
import { baseUrl } from "../../core"
import PrimarySearchAppBar from "./Appbar"
import CardItem from "./Post";
import PostForm from "./PostForm";
import "./dashboard.css"


function Dashboar() {
  let { state, dispatch } = useContext(GlobalContext);


  function logout() {
    dispatch({
      type: "USER_LOGOUT"
    })
  }

  return (
    <>
    <PrimarySearchAppBar />
    <h1>{state.user.email}</h1>
    <PostForm />
    <CardItem title = "test" />
    </>
  );
}

export default Dashboar;