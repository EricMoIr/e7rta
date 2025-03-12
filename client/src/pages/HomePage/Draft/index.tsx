import { FC, useCallback, useEffect, useState } from "react";
import PlayerDraft from "../PlayerDraft";
import HeroPicker from "../HeroPicker";
import DraftActions from "../DraftActions";
import { useFetch } from "../../../hooks/useFetch";
import { getHero } from "../../../utils";
import DraftResults from "../DraftResults";

const Draft: FC = () => {
  const [isFirstPick, setIsFirstPick] = useState(true);
  const [myHeroes, setMyHeroes] = useState<Hero[]>([]);
  const [theirHeroes, setTheirHeroes] = useState<Hero[]>([]);
  const [availableHeroes, setAvailableHeroes] = useState<Hero[]>([]);
  const { data, loading } = useFetch<Hero[]>(
    `${import.meta.env.BASE_URL}e7_heroes.json`,
    "json"
  );
  const [bestDrafts, setBestDrafts] = useState<DraftDTO[]>([]);
  const [currentBestDraftIndex, setCurrentBestDraftIndex] = useState(-1);

  useEffect(() => {
    const i = currentBestDraftIndex;
    if (i === -1) return;
    if (bestDrafts[i].draft.isFirstPick === isFirstPick) {
      setMyHeroes(bestDrafts[i].draft.myHeroes.map((h) => getHero(h, data!)));
      setTheirHeroes(
        bestDrafts[i].draft.theirHeroes.map((h) => getHero(h, data!))
      );
    } else {
      setMyHeroes(
        bestDrafts[i].draft.theirHeroes.map((h) => getHero(h, data!))
      );
      setTheirHeroes(
        bestDrafts[i].draft.myHeroes.map((h) => getHero(h, data!))
      );
    }
  }, [bestDrafts, currentBestDraftIndex, data, isFirstPick]);

  useEffect(() => {
    if (!bestDrafts.length || !data) return;
    setCurrentBestDraftIndex(0);
  }, [bestDrafts, data]);

  useEffect(() => {
    if (data && data.length) {
      setAvailableHeroes(data);
    }
  }, [data]);

  const handleHeroPicked = useCallback(
    (hero: Hero) => {
      const turnOrder = {
        0: true,
        1: false,
        2: false,
        3: true,
        4: true,
        5: false,
        6: false,
        7: true,
        8: true,
        9: false,
      };
      let isMyHero =
        turnOrder[
          (myHeroes.length + theirHeroes.length) as keyof TurnOrderTable
        ];
      if (!isFirstPick) {
        isMyHero = !isMyHero;
      }
      if (isMyHero) {
        setMyHeroes([...myHeroes, hero]);
      } else {
        setTheirHeroes([...theirHeroes, hero]);
      }
      setAvailableHeroes(availableHeroes.filter((h) => h.code !== hero.code));
    },
    [
      myHeroes,
      setMyHeroes,
      theirHeroes,
      setTheirHeroes,
      isFirstPick,
      availableHeroes,
      setAvailableHeroes,
    ]
  );

  const handleClear = useCallback(() => {
    setMyHeroes([]);
    setTheirHeroes([]);
    setAvailableHeroes(data!);
    setCurrentBestDraftIndex(-1);
  }, [setMyHeroes, setTheirHeroes, setAvailableHeroes, data]);

  const handleSearchDrafts = useCallback(async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bestPicks`, {
      method: "POST",
      body: JSON.stringify({
        myHeroes: myHeroes.map((h) => ({ id: h.code })),
        theirHeroes: theirHeroes.map((h) => ({ id: h.code })),
        isFirstPick,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { drafts } = (await response.json()) as BestPicksDTO;
    setBestDrafts(drafts);
  }, [isFirstPick, myHeroes, theirHeroes]);

  return (
    <div>
      <HeroPicker
        onHeroPicked={handleHeroPicked}
        disabled={myHeroes.length + theirHeroes.length === 10}
        heroes={availableHeroes}
        loading={loading}
      />
      <div className="flex justify-center">
        <PlayerDraft
          isFirstPick={isFirstPick}
          onFirstPickChange={() => setIsFirstPick(true)}
          heroes={myHeroes}
          isMine
        />
        <div className="flex-1 min-w-80 flex flex-col">
          {currentBestDraftIndex !== -1 && (
            <DraftResults
              bestDrafts={bestDrafts}
              index={currentBestDraftIndex}
              onPrev={() => setCurrentBestDraftIndex((i) => i - 1)}
              onNext={() => setCurrentBestDraftIndex((i) => i + 1)}
            />
          )}
          <DraftActions
            onClear={handleClear}
            onSearchDrafts={handleSearchDrafts}
            loading={loading}
          />
        </div>
        <PlayerDraft
          isFirstPick={!isFirstPick}
          onFirstPickChange={() => setIsFirstPick(false)}
          heroes={theirHeroes}
          isMine={false}
        />
      </div>
    </div>
  );
};

export default Draft;
