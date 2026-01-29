"use client";

import React from "react";
import Layout from "../../components/Layout";
import Chat from "../components/chat";
import styles from "./page.module.css";

const ChatPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Chat />
      </div>
    </Layout>
  );
};

export default ChatPage;
