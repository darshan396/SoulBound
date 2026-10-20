
import "./PlayerHUD.css";

type PlayerHUDProps = {
  name: string;
  health: number;
  maxHealth?: number;
  mana: number;
  maxMana?: number;
  opponent?: boolean;
  avatar?: string;
};

export default function PlayerHUD({
  name,
  health,
  maxHealth = 30,
  mana,
  maxMana = 8,
  opponent = false,
  avatar,
}: PlayerHUDProps) {
  const safeMaxHealth = Math.max(1, maxHealth);
  const safeHealth = Math.max(0, Math.min(health, safeMaxHealth));
  const safeMaxMana = Math.max(0, maxMana);
  const safeMana = Math.max(0, Math.min(mana, safeMaxMana));

  const healthPercentage = (safeHealth / safeMaxHealth) * 100;

  return (
    <section
      className={`player-hud ${opponent ? "opponent" : "player"}`}
      aria-label={`${name} status`}
    >
      <div className="avatar">
        {avatar ? (
          <img src={avatar} alt={`${name} avatar`} />
        ) : (
          <span aria-hidden="true">{opponent ? "☠" : "♜"}</span>
        )}
      </div>

      <div className="hud-details">
        <div className="player-name">{name}</div>

        <div
          className="health-track"
          role="progressbar"
          aria-label="Health"
          aria-valuemin={0}
          aria-valuemax={safeMaxHealth}
          aria-valuenow={safeHealth}
        >
          <div
            className="health-fill"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>

        <div className="mana-track" aria-label={`Mana: ${safeMana}/${safeMaxMana}`}>
          {Array.from({ length: safeMaxMana }, (_, index) => (
            <span
              key={index}
              className={
                index < safeMana
                  ? "mana-crystal active"
                  : "mana-crystal"
              }
            />
          ))}

          <span className="mana-label">
            {safeMana}/{safeMaxMana}
          </span>
        </div>
      </div>

      <div className="health-number">
        {safeHealth}
      </div>
    </section>
  );
}
