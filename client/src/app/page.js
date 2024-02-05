import KeyPressComponent from "./components/KeyPressComponent"
import SignalVisualizer from "./components/SignalVisualizer"
import Scene from "./components/Scene"
import { SocketProvider } from "./context/SocketContext"

export default function Home() {
  const entities = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      label: "user1",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      label: "user2",
    },
  ]

  const signalInfo = [
    {
      type: "love",
      label: "Love",
      color: "rgba(255, 99, 132, 0.5)",
      data: [],
      icon: "❤️",
      triggerKey: "l",
    },
    {
      type: "think",
      label: "Think",
      color: "rgba(54, 162, 235, 0.5)",
      data: [],
      icon: "💭",
      triggerKey: "t",
    },
    {
      type: "joy",
      label: "Joy",
      color: "rgba(255, 206, 86, 0.5)",
      data: [],
      icon: "😄",
      triggerKey: "j",
    },
    {
      type: "sadness",
      label: "Sadness",
      color: "rgba(75, 192, 192, 0.5)",
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
          <Scene entities={entities} signalInfo={signalInfo} />
          <SignalVisualizer signalInfo={signalInfo} />
        </SocketProvider>
      </div>
    </main>
  )
}
