import React from "react";
import InteractivePlayer from "../player/InteractivePlayer";

export default function DemoPreview({ demo, onClose }) {
  return <InteractivePlayer demo={demo} onClose={onClose} />;
}