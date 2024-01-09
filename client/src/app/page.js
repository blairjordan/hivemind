import KeyPressComponent from "./components/KeyPressComponent"
import SignalVisualizer from "./components/SignalVisualizer"
import Scene from "./components/Scene"
import { SocketProvider } from "./context/SocketContext"

export default function Home() {
  const signalInfo = [
    {
      type: "love",
      label: "Love",
      color: "rgba(255, 99, 132, 1)",
      data: [],
      icon: "❤️",
      triggerKey: "l",
    },
    {
      type: "think",
      label: "Think",
      color: "rgba(54, 162, 235, 1)",
      data: [],
      icon: "💭",
      triggerKey: "t",
    },
    {
      type: "joy",
      label: "Joy",
      color: "rgba(255, 206, 86, 1)",
      data: [],
      icon: "😄",
      triggerKey: "j",
    },
    {
      type: "sadness",
      label: "Sadness",
      color: "rgba(75, 192, 192, 1)",
      data: [],
      icon: "😢",
      triggerKey: "s",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <SocketProvider>
          {signalInfo.map((signal) => (
            <KeyPressComponent
              icon={signal.icon}
              triggerKey={signal.triggerKey}
              signalType={signal.type}
              key={signal.type}
            />
          ))}
          <Scene signalInfo={signalInfo} />
          <SignalVisualizer signalInfo={signalInfo} />
        </SocketProvider>
      </div>
    </main>
  )
}
