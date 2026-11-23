import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "@/lib/api"
import PublicBlock from "@/components/profile/PublicBlock"
import {
  getButtonStyles,
  getFontFamily,
  getPageBackground,
} from "@/lib/appearance"

export default function PublicProfilePage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get(`/profile/public/${username}`)
        setData(response.data)
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        Loading...
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-4xl font-black">Page not found</h1>
          <p className="mt-2 text-neutral-500">
            This Linkora username does not exist.
          </p>
        </div>
      </div>
    )
  }

  const { creator, blocks } = data
  const appearance = creator.appearance || {}
  const buttonStyle = getButtonStyles(appearance)

  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{
        ...getPageBackground(appearance),
        fontFamily: getFontFamily(appearance.font),
        color: appearance.textColor,
      }}
    >
      <div className="mx-auto max-w-xl">
        <header className="text-center">
          <div className="mx-auto grid size-24 place-items-center overflow-hidden rounded-full bg-black/10 text-3xl font-black">
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              creator.displayName?.charAt(0)?.toUpperCase()
            )}
          </div>
          <h1 className="mt-4 text-2xl font-black">
            {creator.displayName}
          </h1>

          {creator.bio && (
            <p className="mx-auto mt-2 max-w-md text-sm opacity-75">
              {creator.bio}
            </p>
          )}
        </header>

        <div className="mt-8 space-y-4">
          {blocks.map((block) => (
            <PublicBlock
              key={block._id}
              block={block}
              buttonClass="block w-full px-5 py-4 text-center font-semibold transition hover:-translate-y-0.5"
              style={buttonStyle}
            />
          ))}
        </div>

        <footer className="mt-10 text-center text-xs font-bold opacity-50">
          linkora
        </footer>
      </div>
    </main>
  )
}
