import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function KotlinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 125 125"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn(props.className)}
    >
      <defs>
        <linearGradient id="kotlin-b" x1="-21.045" y1="114.925" x2="95.274" y2="-1.395" gradientUnits="userSpaceOnUse">
          <stop offset=".108" stopColor="#c757bc" />
          <stop offset=".173" stopColor="#cd5ca9" />
          <stop offset=".492" stopColor="#e8744f" />
          <stop offset=".716" stopColor="#f88316" />
          <stop offset=".823" stopColor="#ff8900" />
        </linearGradient>
        <linearGradient id="kotlin-a" x1="39.893" y1="147.552" x2="96.589" y2="90.856" gradientUnits="userSpaceOnUse">
          <stop offset=".296" stopColor="#00afff" />
          <stop offset=".694" stopColor="#5282ff" />
          <stop offset="1" stopColor="#945dff" />
        </linearGradient>
        <linearGradient id="kotlin-c" x1="-1.501" y1="34.501" x2="38.272" y2="-5.273" href="#kotlin-a" />
      </defs>
      <title>icon_Kotlin</title>
      <path fill="url(#kotlin-b)" d="M62.759 0L0 65.999V125l62.669-62.779L125 0H62.759z" />
      <path fill="url(#kotlin-a)" d="M0 125l62.669-62.778L125 125H0z" />
      <path fill="url(#kotlin-c)" d="M0 0h62.759L0 65.999V0z" />
    </svg>
  );
}
