import { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface Props {}

function ChatFeed(props: Props) {
  const [data, setData] = useState();
  useEffect(() => {}, [props]);

  return (
    <div className={styles.green}>
      <p>chat feed</p>
    </div>
  );
}

export default ChatFeed;
