type AvatarProps = {
  name: string;
  size?: number;
};

const Avatar = ({ name, size = 40 }: AvatarProps) => {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const dimension = {
    width: size,
    height: size,
  };

  return (
    <div
      style={dimension}
      className="flex items-center justify-center rounded-full bg-orange-500 font-medium text-white"
    >
      {initial}
    </div>
  );
};

export default Avatar;
