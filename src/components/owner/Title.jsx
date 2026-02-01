import React from 'react'

const Title = ({ title, subTitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
      {subTitle && (
        <p className="mt-2 text-gray-500 text-sm max-w-2xl">
          {subTitle}
        </p>
      )}
    </div>
  )
}

export default Title
