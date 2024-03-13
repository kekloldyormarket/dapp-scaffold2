import { FC } from 'react';

import Link from 'next/link';

export const BasicsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Referral
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <Link href="/?ref=7ihN8QaTfNoDTRTQGULCzbUT3PHwPDTu5Brcu4iT2paP">
            <a className="btn btn-primary">This is My Referral Link - replace 7ihn with your solami pubkey</a>
            </Link>
        </div>
      </div>
    </div>
  );
};
