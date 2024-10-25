"use client";

import Link from "next/link";
import Button from "../UI/button/button";
import toast from "react-hot-toast";
import CopiedIcon from "../UI/icons/link-copied-clipboard";

function PreviewHeader() {
  const shareLink = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url)
      .then(() => {
        toast("Link copied to your clipboard!", {
          icon: <CopiedIcon />,
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <header className="w-full h-[78px] md:p-4">
      <div className="p-4 flex items-center justify-between gap-3 md:bg-white md:rounded-xl">
        <div className="flex-1 md:flex-none">
          <Link
            href="/userdashboard"
            className="block w-full bg-white border border-solid border-primary-index hover:bg-neutral-light-purple text-primary-index text-sm font-bold rounded-md px-4 py-3 transition-colors duration-300 ease-in-out text-center"
          >
            Back to Customization
          </Link>
        </div>
        <div className="flex-1 md:flex-none">
          <Button style={"primary"} onClick={shareLink}>
            Copy Link
          </Button>
        </div>
      </div>
    </header>
  );
}

export default PreviewHeader;
