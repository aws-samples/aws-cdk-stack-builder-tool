import logo from "../../assets/192x192.png";

export function Header() {
  return (
    <div className="flex items-center space-x-5">
      <div className="flex-shrink-0">
        <div className="relative">
          <img className="h-16 w-16" src={logo} alt="" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AWS CDK Builder</h1>
        <p className="text-sm font-medium text-gray-500">
          CDK Project Bootstrapping
        </p>
      </div>
    </div>
  );
}
