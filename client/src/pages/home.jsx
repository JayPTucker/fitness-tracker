import { useState } from "react";
import axios from "axios";

function Home() {

  return (
    <div>
        <p>Home page</p>
        <a href="/register">Register</a>
        <br></br>
        <a href="/login">Login</a>
    </div>
  );
}

export default Home;