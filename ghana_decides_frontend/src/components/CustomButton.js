import { Link } from 'react-router-dom';

function CustomButton({ to, children }) {
  return (
    <Link to={to}>
      <div className="w-60 h-20 bg-black bg-opacity-25 backdrop-blur-lg rounded-lg flex items-center justify-center m-3 shadow-md">
        <p className="text-white text-xl font-bold p-4 text-center" style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
          {children}
        </p>
      </div>
    </Link>
  );
}

export default CustomButton;
