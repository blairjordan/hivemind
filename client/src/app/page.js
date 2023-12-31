import KeyPressComponent from "./components/KeyPressComponent"
import SignalVisualizer from "./components/SignalVisualizer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <KeyPressComponent />
        <SignalVisualizer />
      </div>
    </main>
  )
}
