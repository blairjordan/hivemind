import KeyPressComponent from "./components/KeyPressComponent"
import SignalVisualizer from "./components/SignalVisualizer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <KeyPressComponent icon="❤️" triggerKey="l" signalType="love" />
        <KeyPressComponent icon="👍" triggerKey="t" signalType="think" />
        <SignalVisualizer />
      </div>
    </main>
  )
}
