import React from 'react';
import { BeatLoader} from 'react-spinners';


const Loader: React.FC = () => {
  return (
    <div>
      <BeatLoader  size={30} color="#3B82F6" loading={true} />
    </div>
  );
};

export default Loader;