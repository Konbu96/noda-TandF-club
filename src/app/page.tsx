import Carousel from "../components/Carousel";

export default function Home() {
  return (
    <div className="bg-white text-center p-6 text-black">
      <Carousel/>

      <div className="p-4">
        <h2 className="">ニュース</h2>
        <ul>
          <li>2025</li>
          <li>2025</li>
          <li>2025</li>
        </ul>
      </div>

      <div className="p-4 list-none">
        <h2>スケジュール</h2>
        <li>月曜日</li>
        <li>火曜日</li>
        <li>水曜日</li>
        <li>木曜日</li>
        <li>金曜日</li>
        <li>土曜日</li>
        <li>日曜日</li>
      </div>
    </div>
  );
}  