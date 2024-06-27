import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'
// import Logout from './Logout';

function Welcome({ currentUser }) {
  // console.log(currentUser);
  // const username = currentUser ? currentUser.username : '';
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span> {currentUser.username}! </span>
      </h1>
      <h3>Please Select a User to Chat</h3>
      {/* <Logout /> */}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome