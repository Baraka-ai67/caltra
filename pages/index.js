import { useState } from "react";

export default function Home() {
  const [img, setImg] = useState(null);
  const [result, setResult] = useState("");

  const uploadImage = async () => {
    if (!img) return;

    const formData = new FormData();
    formData.append("file", img);

    const resp = await fetch("/api/analyse", {
      method: "POST",
      body: formData,
    });

    const data = await resp.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Calorie AI</h1>
      <p>Upload an image of your food.</p>
      <input type="file" onChange={(e) => setImg(e.target.files[0])} />
      <button onClick={uploadImage}>Analyse</button>

      <pre>{result}</pre>
    </div>
  );
}
