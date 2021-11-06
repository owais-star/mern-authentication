import {useState} from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { baseUrl } from "../../core"
import { GlobalContext } from "../context/Context";
import { useContext } from "react";
import Message from "../message/Message"




export default function PostForm() {
    let { state, dispatch } = useContext(GlobalContext);
    const [inputText, setInputText] = useState("");

    const inputOnChange = (e) => {
        setInputText(e.target.value);
    };

    const submitPost = (a) => {
        a.preventDefault();
        if (inputText !== "") {
            if (state?.user?.firstName) {
                axios
                    .post(`${baseUrl}/api/v1/post`, {
                        text: inputText,
                        author: state.user.fullName,
                    })
                    .then((result) => {
                        // console.log(result.data);
                    });
            }
        }
    };

    return (
        <>
            <form onSubmit={submitPost}>
                <Box
                    sx={{
                        "& > :not(style)": {
                            marginTop: "20px",
                            marginBottom: "14px",
                            width: "100%",
                        },
                    }}
                    autoComplete="off"
                >
                    <TextField
                        label="Enter text"
                        value={inputText}
                        onChange={inputOnChange}
                        variant="filled"
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    style={{ marginBottom: "40px" }}
                    type="submit"
                >
                    Post
                </Button>
            </form>
        </>
    )
}