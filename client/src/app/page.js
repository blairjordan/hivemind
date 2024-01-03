import KeyPressComponent from "./components/KeyPressComponent"
import SignalVisualizer from "./components/SignalVisualizer"
import Scene from "./components/Scene"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <KeyPressComponent icon="❤️" triggerKey="l" signalType="love" />
        <KeyPressComponent icon="👍" triggerKey="t" signalType="think" />
        <KeyPressComponent icon="🍆" triggerKey="s" signalType="sex" />
        <KeyPressComponent icon="😡" triggerKey="a" signalType="anger" />
        {/* <SignalVisualizer /> */}
        <Scene />
      </div>
    </main>
  )
}
