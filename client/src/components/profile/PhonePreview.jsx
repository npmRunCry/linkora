import PublicBlock from "@/components/profile/PublicBlock"
import { useProfile } from "@/context/ProfileContext";
import {
  getButtonStyles,
  getFontFamily,
  getPageBackground,
} from "@/lib/appearance"

export default function PhonePreview() {
  const { profile, blocks, loading } = useProfile();

  if (loading || !profile) {
    return (
      <div className="mx-auto h-[620px] w-[300px] animate-pulse rounded-[42px] bg-neutral-100" />
    );
  }

    const appearance = profile.appearance || {}
    const buttonStyle = getButtonStyles(appearance)

  return (
    <div className="mx-auto w-[300px] rounded-[42px] border-[8px] border-neutral-900 bg-white p-2 shadow-xl">
      <div
        className="h-[590px] overflow-y-auto rounded-[31px] p-5"
        style={{
          ...getPageBackground(appearance),
          fontFamily: getFontFamily(appearance.font),
          color: appearance.textColor,
        }}
      >
        <div className="text-center">
          <div className="mx-auto grid size-20 place-items-center overflow-hidden rounded-full bg-black/10 text-2xl font-bold">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              profile.displayName?.charAt(0)?.toUpperCase()
            )}
          </div>

          <h2 className="mt-3 font-bold">{profile.displayName}</h2>
          <p className="mt-1 text-xs opacity-70">{profile.bio}</p>
        </div>

        <div className="mt-5 space-y-3">
          {blocks
            .filter((block) => block.active)
            .map((block) => (
              <PublicBlock
                key={block._id}
                block={block}
                buttonClass="block w-full px-4 py-3 text-center text-sm font-semibold"
                style={buttonStyle}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
