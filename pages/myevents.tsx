import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const events = [
    {
      Day: "Friday",
      Time: "Evening",
      Activity: "Poker",
      NumberOfPeople: "6/8",
      GroupChat: <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
    },
    {
        Day: "Friday",
        Time: "Late Night",
        Activity: "Poker",
        NumberOfPeople: "8/8",
        GroupChat:  <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
    },
    {
        Day: "Saturday",
        Time: "Morning",
        Activity: "Basketball",
        NumberOfPeople: "6/10",
        GroupChat:  <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
    },
    {
        Day: "Sunday",
        Time: "Afternoon",
        Activity: "Basketball",
        NumberOfPeople: "9/10",
        GroupChat:  <a href="https://www.emory.edu/home/index.html">Join GroupChat</a>,
    },
  ]
  
  export default function TableDemo() {
    return (
        <div className="flex flex-col items-center justify-center pt-16 gap-9">
        <h1 className="text-6xl font-bold text-center"> My Events </h1>
      <Table>
        <TableCaption>A list of your upcomming events.</TableCaption>
        <TableHeader>
          <TableRow className="justify-center">
            <TableHead className="text-pink cursor-pointer ml-2 font-bold ">Day</TableHead>
            <TableHead className="text-pink cursor-pointer ml-2 font-bold" >Time</TableHead>
            <TableHead className="text-pink cursor-pointer ml-2 font-bold" >Activity</TableHead>
            <TableHead className="text-pink cursor-pointer ml-2 font-bold" >Confirmed </TableHead>
            <TableHead className="text-pink cursor-pointer ml-2 font-bold" >Group Chat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((events) => (
            <TableRow key={events.Day}>
              <TableCell >{events.Day}</TableCell>
              <TableCell>{events.Time}</TableCell>
              <TableCell>{events.Activity}</TableCell>
              <TableCell>{events.NumberOfPeople}</TableCell>
              <TableCell >{events.GroupChat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    )
  }
  