import goldJimki from "./gold-jimki.jpg";
import diamondSolitaireRing from "./diamond-solitaire-ring.jpg";
import goldMattalSet from "./gold-mattal-set.jpg";
import platinumWeddingBand from "./platinum-wedding-band.jpg";
import silverTempleAnklet from "./silver-temple-anklet.jpg";
import goldBallDropEarrings from "./gold-ball-drop-earrings.jpg";
import diamondStudEarrings from "./diamond-stud-earrings.jpg";
import goldChain22k from "./gold-chain-22k.jpg";
import rubyStoneNecklace from "./ruby-stone-necklace.jpg";
import copperPoojaSet from "./copper-pooja-set.jpg";
import goldBangleSet from "./gold-bangle-set.jpg";
import silverDiamondPendant from "./silver-diamond-pendant.jpg";
import goldRedstoneStud from "./gold-redstone-stud.jpg";
import platinumGoldRing from "./platinum-gold-ring.jpg";
import babyGoldBracelet from "./baby-gold-bracelet.jpg";
import ghDiamondNecklace from "./gh-diamond-necklace.jpg";

// Map SKU codes to local product images
export const productImageMap: Record<string, string> = {
  "GLD-JMK-001": goldJimki,
  "DIA-SOL-001": diamondSolitaireRing,
  "GLD-MAT-001": goldMattalSet,
  "PLT-BND-001": platinumWeddingBand,
  "SLV-ANK-001": silverTempleAnklet,
  "GLD-BLD-001": goldBallDropEarrings,
  "DIA-STD-001": diamondStudEarrings,
  "GLD-CHN-001": goldChain22k,
  "STN-RBY-001": rubyStoneNecklace,
  "CPR-POJ-001": copperPoojaSet,
  "GLD-BNG-001": goldBangleSet,
  "SLV-DIA-001": silverDiamondPendant,
  "GLD-RST-001": goldRedstoneStud,
  "PLT-GLD-001": platinumGoldRing,
  "GLD-BBY-001": babyGoldBracelet,
  "DIA-GHN-001": ghDiamondNecklace,
};

export const getProductImage = (skuCode: string, imageUrl?: string | null): string | undefined => {
  if (imageUrl) return imageUrl;
  return productImageMap[skuCode];
};
