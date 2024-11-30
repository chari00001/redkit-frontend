import React from 'react'
import { FaUsers, FaGamepad, FaMusic, FaFilm, FaCode } from 'react-icons/fa'

const PopularCommunities = () => {
  const communities = [
    {
      icon: <FaGamepad />,
      name: 'r/gaming',
      members: '34.2M members',
      description: 'A community for gaming enthusiasts'
    },
    {
      icon: <FaMusic />, 
      name: 'r/Music',
      members: '30.1M members',
      description: 'The musical corner of Reddit'
    },
    {
      icon: <FaFilm />,
      name: 'r/movies',
      members: '29.8M members', 
      description: 'News & Discussion about Major Motion Pictures'
    },
    {
      icon: <FaCode />,
      name: 'r/programming',
      members: '8.2M members',
      description: 'Programming discussions and news'
    }
  ]

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-base font-medium mb-4">Popular Communities</h2>
      
      <div className="space-y-4">
        {communities.map((community, index) => (
          <div key={index} className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
            <div className="text-gray-500 mt-1">
              {community.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium">{community.name}</h3>
              <p className="text-xs text-gray-500">{community.members}</p>
              <p className="text-xs text-gray-600 mt-1">{community.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularCommunities