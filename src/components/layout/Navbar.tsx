
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute(item.href)
                    ? "bg-flow-blue text-white dark:bg-flow-blue/80"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
            
            <Link
              to="/create-simulation"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FlaskConical className="h-4 w-4 mr-2" />
                Create Simulation
              </div>
            </Link>
          </div>
        </div>
      )}
