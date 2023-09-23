import { useEffect, useState } from "react";
import styles from "./index.module.scss";

interface Props {}

function Template(props: Props) {
  const [data, setData] = useState();
  useEffect(() => {}, [props]);

  return (
    <div className={styles.green}>
      <p>template</p>
    </div>
  );
}

export default Template;
