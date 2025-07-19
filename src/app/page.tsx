import Image from "next/image";
import { topPhotos } from "./photo";

export default function Home() {
  return (
    <div className="bg-white text-center">
      <h1 className="text-[50px] text-blue-900 font-bold mb-0">
        野田学園陸上競技部
      </h1>

      <section>
        <h2 className="text-[40px] text-blue-500 mt-0">
        部活風景
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {topPhotos.map((photo,index) => (
          <div key={index} className="relative w-full h-60 overflow-hidden rounded-lg">
             <Image
            src={photo.path}
            alt={photo.alt}
            fill={true}
            className="object-cover"
           />
          </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}  
