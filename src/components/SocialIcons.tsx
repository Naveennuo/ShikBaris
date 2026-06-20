import React from "react";

const SocialIcons: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={
        "absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 " +
        className
      }
    >
      <a
        href="https://www.instagram.com/shikbarisholidays/"
        aria-label="Instagram"
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" className="text-pink-600">
          <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM18.5 6a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
        </svg>
      </a>

      <a
        href="#"
        aria-label="Facebook"
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" className="text-blue-600">
          <path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2v-2.9h2.2V9.1c0-2.2 1.3-3.4 3.2-3.4c.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12z" />
        </svg>
      </a>

      <a
        href="#"
        aria-label="YouTube"
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" className="text-red-600">
          <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.4.6A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8a3 3 0 0 0 2.1 2.1c1.6.6 9.4.6 9.4.6s7.8 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8zM9.8 15.6V8.4l6.2 3.6l-6.2 3.6z" />
        </svg>
      </a>
    </div>
  );
};

export default SocialIcons;
