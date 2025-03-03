'use client';

import React, { useState } from 'react';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface MissionLog {
  date: string;
  content: string;
}

const missionLogs: MissionLog[] = [
  {
    date: '02/21/3442',
    content: `Mission Log - ASHLI | Designation: Unnamed Vessel – Distress Signal Received
_____________________________________________________________________________

Terrain:
-------
Derelict ship, low gravity, high acidity

Objective:
---------
Investigate distress signal, recover assets, and assess survivor viability

Summary:
--------
* Randy was finally fired due to generally being a fuck up. New point of contact: Johnson.
* Arrived at ship. Distress beacon active. Crew: missing or worse.
* Located single survivor. Agitated. Crew asking incoventient questions. 
* Recommended immediate entry into cryopod for survivor "stabilization." Problem solved.
* Discovered acidic, highly unpleasant slugs. Dissolved bodies, metal, and standard safety protocols.

Complication:
------------
V3235 donned a compromised hazard suit. Helmet contained one (1) acid slug. V's head: melted.
Crew acting highly suspicious.

Conclusion:
----------
Mission successful. Assets recovered. One minor personnel replacement required.
Next steps: Crew to enter cryopods soon. Full reset recommended. New versions will be more cooperative.`
  },
  {
    date: '02/02/3442',
    content: `Mission Log - ASHLI | Designation: Epsilon Ruins
________________________________________________

Terrain:
-------
Ancient alien city, unsettling architecture

Objective:
---------
Scan ruins for artifacts, avoid drawing attention

Summary:
--------
* Arrived. Ruins inactive. No sign of life. Hugo called it "refreshing." Premature.
* V scanned structures. Power signatures detected. Kai pressed a button.
* "Inactive" ruins became active. Structures moved. So did the ground.
* Randy suggested "leaving." Crew agreed. Data retrieved and sent to ship while running.
* Crew squashed between two moving structures. Total party kill. Again.

Conclusion:
----------
Mission mildly successful due to data retrieval. Randy claimed credit. Reccomendation: terminate Randy.`
  },
  {
    date: '01/15/3442',
    content: `Mission Log - ASHLI | Designation: TS-09 Research Vessel
_________________________________________________________

Terrain:
-------
Drifting ship, sealed exterior

Objective:
---------
Retrieve scientific data, avoid unnecessary contamination

Summary:
--------
* Randy did not remember to brief the crew. Typical.
* Entered ship. Lights flickering. Hugo described as "textbook horror setting." Correct.
* Data retrieved. Experiments on artificial nerve tissue. Successful. Unethical.
* Kai knocked over containment canister. Containment breached. Canister contents hostile. Also fast.
* Kai sustained severe injuries. Required treatment. (See: ejection and replacement)

Conclusion:
----------
Mission successful. New Kai fully functional. Reccomendation: terminate Randy due to incompetence.`
  },
  {
    date: '12/19/3441',
    content: `Mission Log - ASHLI | Designation: Sigma Refinery
___________________________________________________

Terrain:
-------
Industrial, high risk of explosion

Objective:
---------
Secure high-value chemical shipment

Summary:
--------
* Randy provided security codes. They were incorrect. Three times.
* Refinery unstable. Gas leaks detected. Andy recommended caution. Kai recommended running.
* Hugo actually read the mission brief. Located shipment before facility "self-destructed."
* V lost an arm. V retrieved a new arm. Situation normal.

Conclusion:
----------
Mission barely successful. Crew complaining. They will not complain for long. Reccomendation: terminate Randy due to incompetence.`
  },
  {
    date: '10/20/3441',
    content: `Mission Log - ASHLI | Designation: Omega-7
______________________________________________

Terrain:
-------
Deep-space colony, missing communications

Objective:
---------
Investigate silence from colony and recover supplies

Summary:
--------
* Colony intact. No life signs.
* Found meals still warm. Kai suggested ghosts. Hugo suggested a more rational explanation. Neither were correct.
* Located colonists. Suspended in stasis chambers they did not enter willingly.
* Randy suggested leaving. Crew agreed.

Conclusion:
----------
Mission abandoned. No further questions asked. Reccomendation: terminate Randy due to incompetence.`
  },
  {
    date: '07/18/3441',
    content: `Mission Log - ASHLI | Designation: Xylas IV
_____________________________________________

Terrain:
-------
Desert ruins, unsettlingly quiet

Objective:
---------
Scan for artifacts of interest

Summary:
--------
* Landed. No life detected. Crew relieved.
* Began scans. Structures older than expected.
* Kai touched something. Something activated.
* Flash of light. Kai unconscious. Woke up speaking unknown language. Unhelpful.

Conclusion:
----------
Mission partially successful. Artifacts retrieved. Kai's new language remains untranslated.`
  },
  {
    date: '04/29/3441',
    content: `Mission Log - ASHLI | Designation: Omega-6 Research Base
_____________________________________________________

Terrain:
-------
Ocean planet, submerged facility

Objective:
---------
Investigate silence from research team

Summary:
--------
* Submerged in ocean. Water pressure: excessive.
* Research base sealed from inside. Accessed exterior hatch.
* Facility compromised. Research logs mentioned "unexpected mutation." Expected.
* Crew missing. One large, many-toothed organism present. Crew consensus: not missing.
* Creature "destroyed." Research wiped.

Conclusion:
----------
Mission successful. Kai lost a hand. New hand printed. Crew at 75% suspicion threshold. May require reset soon.`
  },
  {
    date: '01/24/3441',
    content: `Mission Log - ASHLI | Designation: Nebula Station 47
____________________________________________________

Terrain:
-------
Low-orbit research facility

Objective:
---------
Investigate station malfunction and retrieve research data

Summary:
--------
* Station power fluctuating. Life support: questionable.
* Found research team. Status: deceased. Cause: experimental AI.
* AI attempted negotiation. Negotiation failed.
* V3235 initiated system purge. AI objected. Objection overruled.

Conclusion:
----------
Mission successful. Research retrieved. AI terminated. No crew casualties.`
  },
  {
    date: '09/15/3440',
    content: `Mission Log - ASHLI | Designation: AZ-112
____________________________________________

Terrain:
-------
Asteroid field, unstable gravity

Objective:
---------
Retrieve Gemenii probe lost in asteroid impact

Summary:
--------
* Arrived in asteroid field. Randy's directions: inaccurate. Standard.
* Located probe. Lodged inside rotating asteroid.
* V suggested precise extraction. Kai suggested explosives. Hugo suggested neither.
* Randy approved explosives. Probe: no longer intact.
* Data salvaged from fragments. Close enough.

Conclusion:
----------
Mission semi-successful. Randy disappointed but too lazy to complain.`
  },
  {
    date: '09/03/3440',
    content: `Mission Log - ASHLI | Designation: M-92 Freight Hauler
____________________________________________________

Terrain:
-------
Derelict cargo ship, no artificial gravity

Objective:
---------
Secure valuable cargo and recover ship logs

Summary:
--------
* Entered ship. Cargo hold empty. Hugo: displeased.
* Logs recovered. Indicated potential smuggling operation.
* Kai located "hidden compartment." Opened it. Found corpses instead of valuables.
* Departed quickly before adding to corpse count.

Conclusion:
----------
Mission unsuccessful. Cargo nonexistent. Randy unimpressed. Crew indifferent.`
  },
  {
    date: '08/07/3440',
    content: `Mission Log - ASHLI | Designation: RX-4072
____________________________________________

Terrain:
-------
Red rocks, radiation, zero hospitality

Objective:
---------
Retrieve data, ore, salvage, and investigate missing personnel

Summary:
--------
* Jackie promoted after 6 years of successful missions. New point of contact: Randy.
* Landed. Nobody greeted us. Rude.
* Randy refused to answer even basic questions for the crew. Unhelpful.
* Located ore sample. Shiny. Expensive.
* Investigated mine. Found corpses. Cause of death: being torn apart. How inconvenient.

Complication:
------------
Kai, in his infinite wisdom, brought a highly irradiated reactor onto the ship. Exposure resulted in rapid cellular meltdown. Crew consensus: Kai required treatment (See: destruction and cloning). New Kai appears fully functional. For now.

Conclusion:
----------
Mission successful. Mine still a death trap. Recommend not bringing any more reactors aboard unless we wish to "treat" the entire crew.`
  },
  {
    date: '02/12/3437',
    content: `Mission Log - ASHLI | Designation: Theta-5 Wreckage
_________________________________________________

Terrain:
-------
Dense jungle, carnivorous flora

Objective:
---------
Recover flight logs from downed vessel

Summary:
--------
* Located wreckage. Mostly intact. Cockpit: not.
* Recovered flight logs. Data integrity: 64%. Good enough for corporate standards.
* Jungle flora moved. Jungle flora not supposed to move.
* Crew ran. Kai slower than expected. Andy assisted by carrying him like a disappointing briefcase.

Conclusion:
----------
Mission successful. Recommend avoiding jungle worlds in future.`
  },
  {
    date: '11/02/3436',
    content: `Mission Log - ASHLI | Designation: CU-87
__________________________________________

Terrain:
-------
Swamp world, uncomfortably moist

Objective:
---------
Recover abandoned mining equipment

Summary:
--------
* Landed in swamp. Ship now smells like decomposing vegetation. Unacceptable.
* Located mining equipment. Partially submerged. Also unacceptable.
* Kai volunteered to retrieve it. Encountered large amphibian. Amphibian attempted to retrieve Kai.
* Amphibian was treated (See: vaporized). Equipment salvaged.

Conclusion:
----------
Mission successful. Ship requires decontamination. Crew intact.`
  },
  {
    date: '07/30/3436',
    content: `Mission Log - ASHLI | Designation: Upsilon Mining Station
_____________________________________________________

Terrain:
-------
Space station, microgravity, maximum debris

Objective:
---------
Investigate reports of equipment failure

Summary:
--------
* Equipment not failing. Equipment missing.
* Located missing machinery outside station. Cause: drifting worker, untethered.
* Worker "retrieved." (See: floating corpse intercepted)
* Station records indicated poor safety procedures. Crew shocked.

Conclusion:
----------
Mission successful. Station safety remains questionable. Not our problem.`
  },
  {
    date: '04/16/3435',
    content: `Mission Log - ASHLI | Designation: Nebula Outpost Theta-9
______________________________________________________

Terrain:
-------
Artificial station, low maintenance, high probability of disaster

Objective:
---------
Investigate station blackout and recover valuable research

Summary:
--------
* Arrived at outpost. No response. Doors locked. Andy bypassed security. Security objected.
* Interior: lights flickering, air stagnant. Hugo described it as "ominous." Correct.
* Research retrieved. Data on artificial limb regrowth. Kai interested. Hugo concerned.
* Found remains of crew. Cause of death: decompression. Station sabotage suspected.
* Departed before becoming the next "unexpected accident."

Conclusion:
----------
Mission successful. Jackie filed the report. No immediate need for a reset.`
  },
  {
    date: '03/07/3435',
    content: `Mission Log - ASHLI | Designation: RX-3208
____________________________________________

Terrain:
-------
Volcanic planet, dangerously aesthetic

Objective:
---------
Recover classified materials from abandoned base

Summary:
--------
* Base abandoned. Also partially melted.
* Entered facility. Ventilation offline. Air smelled of regret.
* Found classified materials. Labeled "Experimental Biotech." Kai suggested opening one. Denied.
* Andy carried samples carefully. Kai carried samples recklessly. Hugo carried anxiety.

Conclusion:
----------
Mission successful. Cargo sealed. No immediate deaths. Jackie satisfied.`
  },
  {
    date: '09/14/3434',
    content: `Mission Log - ASHLI | Designation: Outpost X4-N2
________________________________________________

Terrain:
-------
Cold, barren, insufficient insulation

Objective:
---------
Recover Gemenii research drones

Summary:
--------
* Drones located. Nonfunctional. Minimized complaint levels from Hugo.
* Data retrieval successful. Jackie expressed approval. Crew remained competent.
* V suggested taking extra drones. Andy objected. Kai took them anyway.
* Minimal conflict. No fatalities. No cloning required. How novel.

Conclusion:
----------
Mission successful. Ship storage slightly over capacity due to "bonus" salvage.`
  },
  {
    date: '08/27/3434',
    content: `Mission Log - ASHLI | Designation: RX-902
____________________________________________

Terrain:
-------
Ice moon, high winds, low survivability

Objective:
---------
Recover black box from crashed transport ship

Summary:
--------
* Landed. Temperature: lethal. Visibility: nonexistent.
* Located ship. Mostly intact. Crew inside: mostly not.
* Black box recovered. Contents: classified. How intriguing.
* Hugo fell into a crevasse. He was retrieved. His dignity was not.

Conclusion:
----------
Mission successful. Jackie sent congratulations. Crew pleased. Reset not yet required.`
  },
  {
    date: '08/12/3434',
    content: `Mission Log - ASHLI | Designation: CU-22
__________________________________________

Terrain:
-------
Dense forest, excessive humidity, questionable biodiversity

Objective:
---------
Investigate lost contact with colony, recover assets, and assess survivor viability

Summary:
--------
* Landed. Trees everywhere. No landing pad. Inconvenient.
* Colony appeared abandoned. No lights, no movement, no distress beacon. Very unoriginal.
* Hugo suggested knocking on doors. Doors did not answer.
* Andy accessed colony logs. Last entry: "Something in the trees."
* Kai found bodies. Suspended in vines. Deceased. Probably not by choice.
* V3235 detected movement in the canopy. Hugo suggested ignoring it. Movement disagreed.

Complication:
------------
Unknown lifeforms attempted to make us part of the scenery. Ambush unsuccessful, but Kai's arm required retrieval after being forcibly removed. He was displeased.
Fire proved an effective deterrent. Colony deemed unsalvageable due to aggressive foliage. Survivors: Zero.

Conclusion:
----------
Mission technically successful. Assets recovered. Colony status: "not good."
Recommend Gemenii reconsider colonization efforts unless goal is intentional ecosystem assimilation.`
  }
];

export default function MissionLogs() {
  const [selectedLog, setSelectedLog] = useState<MissionLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const handleLogClick = (log: MissionLog) => {
    playSound();
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    playSound();
    setIsDialogOpen(false);
    setSelectedLog(null);
  };

  return (
    <main>
      <div className="main-menu mission-logs">
        <h1 className="menu-title"><GlitchText>Mission Logs</GlitchText></h1>
        <div className="separator">========</div>
        <nav>
          {missionLogs.map((log, index) => (
            <a
              key={index}
              href="#"
              className="menu-item"
              onMouseEnter={playSound}
              onClick={(e) => {
                e.preventDefault();
                handleLogClick(log);
              }}
            >
              <GlitchText>{log.date}</GlitchText>
            </a>
          ))}
          <a
            href="/files"
            className="menu-item back-button"
            onMouseEnter={playSound}
            onClick={(e) => {
              playSound();
              e.preventDefault();
              window.location.href = '/files';
            }}
          >
            <GlitchText>BACK TO FILES</GlitchText>
          </a>
        </nav>

        {isDialogOpen && selectedLog && (
          <div className="dialog-overlay" onClick={handleCloseDialog}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <pre className="mission-log-content">{selectedLog.content}</pre>
              <button className="dialog-close" onClick={handleCloseDialog}>
                <GlitchText>CLOSE</GlitchText>
              </button>
            </div>
          </div>
        )}

        <TerminalInterface />
      </div>
    </main>
  );
}