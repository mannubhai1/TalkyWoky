import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import loader from '../assets/loader.gif'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import { setAvatarRoute } from '../utils/APIRoutes'
import { Buffer } from 'buffer'
export default function SetAvatar() {

    const api = "https://api.multiavatar.com/47466374";
    const navigate = useNavigate();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        if (!localStorage.getItem(process.env.LOCALHOST_KEY)) {
            navigate('/login')
        }
    }, [])

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        }
        else {
            const user = await JSON.parse(localStorage.getItem(process.env.LOCALHOST_KEY));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, { image: avatars[selectedAvatar], });
            console.log(data);
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(process.env.LOCALHOST_KEY, JSON.stringify(user));
                navigate('/');
            }
            else {
                toast.error("An error occurred. Please try again.", toastOptions);
            }
        }
    };

    useEffect(() => {
        async function fetchData() {
            const data = [];
            try {
                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = new Buffer(image.data);
                    data.push(buffer.toString("base64"));
                    await delay(1000); // Adding a 1 second delay between requests
                }
                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    toast.error("Too many requests. Please try again later.", toastOptions);
                } else {
                    toast.error("An error occurred. Please try again.", toastOptions);
                }
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);



    return (
        <>{
            isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className='loader' />
                </Container>) : (
                <Container>
                    <div className="title-container">
                        <h1>Choose your Avatar</h1>
                    </div>
                    <div className="avatars">
                        {
                            avatars.map((avatar, index) => {
                                return (
                                    <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button className='submit-btn' onClick={setProfilePicture}> Set as Profile Pic</button>
                </Container>
            )
        }
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;