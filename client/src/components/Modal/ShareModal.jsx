import React from "react";
import {
    EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon,
    TwitterShareButton
} from "react-share";
export default function ShareModal({ url }) {
  return <div className="space-x-3 px-4 py-2 bg-gray-50 dark:bg-[#29292c]">
    <FacebookShareButton url={url}>
        <FacebookIcon round={true} size={32}/>

    </FacebookShareButton>
    <EmailShareButton url={url}>
        <EmailIcon round={true} size={32}/>

    </EmailShareButton>

    <TwitterShareButton url={url}>
        <TwitterIcon round={true} size={32}/>

    </TwitterShareButton>

  </div>;
}
