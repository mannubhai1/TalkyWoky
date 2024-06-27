import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

function Chat() {
  const socket = useRef();

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    if (!localStorage.getItem(process.env.LOCALHOST_KEY)) {
      // console.log("No user found");
      navigate('/login')
    }
    else {
      // console.log("User found");
      async function getCurrentUser() {
        const user = await JSON.parse(localStorage.getItem(process.env.LOCALHOST_KEY));
        setCurrentUser(user);
        setIsLoaded(true);
      }
      getCurrentUser();
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }
        else {
          navigate('/setAvatar');
        }
      }
    }
    fetchData();

  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoaded && currentChat === undefined ?
            (
              // console.log(currentChat, " 1"),
              <Welcome currentUser={currentUser} />
            ) : (
              // console.log(currentChat, " 2"),
              <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
            )
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and(min-width: 720px) and(max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  `;

export default Chat
