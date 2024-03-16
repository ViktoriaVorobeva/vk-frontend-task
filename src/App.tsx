import React, { useState } from "react";
import "./App.css";
import "@vkontakte/vkui/dist/vkui.css";
import { FormFact } from "./components/FormFact/FormFact";
import { View } from "@vkontakte/vkui";
import { FormName } from "./components/FormName/FormName";

function App() {
  const [activePanel, setActivePanel] = useState("facts");
  return (
    <View activePanel={activePanel}>
      <FormFact id="facts" setActivePanel={setActivePanel}/>
      <FormName id="name" setActivePanel={setActivePanel}/>
    </View>
  );
}

export default App;
