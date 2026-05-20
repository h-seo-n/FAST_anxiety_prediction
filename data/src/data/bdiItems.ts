import type { BdiItem } from '../types'

// BDI (Beck Depression Inventory), 21 items, each with 4 statements scored 0–3.
// KOREAN (`ko`): BEST-EFFORT TRANSLATION of the English, NOT the official Korean instrument - official sources restricted by copyright

/** Bilingual instruction shown above the items. */
export const BDI_INSTRUCTION = {
  ko: '각 문항에는 네 개의 문장이 있습니다. 오늘을 포함하여 최근 자신의 상태를 가장 잘 나타내는 문장을 하나씩 고르세요.',
  en: 'Each item has a group of four statements. For each item, pick the one statement that best describes the way you have been feeling, including today.',
}

/** The 21 BDI items in order. Statement index = score (0..3). */
export const bdiItems: BdiItem[] = [
  {
    en: [
      'I do not feel sad.',
      'I feel sad.',
      "I am sad all the time and I can't snap out of it.",
      "I am so sad and unhappy that I can't stand it.",
    ],
    ko: [
      '나는 슬프지 않다.',
      '나는 슬프다.',
      '나는 항상 슬프고 그 기분에서 벗어날 수 없다.',
      '나는 너무 슬프고 불행해서 견딜 수 없다.',
    ],
  },
  {
    en: [
      'I am not particularly discouraged about the future.',
      'I feel discouraged about the future.',
      'I feel I have nothing to look forward to.',
      'I feel the future is hopeless and that things cannot improve.',
    ],
    ko: [
      '나는 미래에 대해 특별히 낙담하지 않는다.',
      '나는 미래에 대해 낙담하고 있다.',
      '나는 기대할 것이 아무것도 없다고 느낀다.',
      '나는 미래가 희망이 없고 나아질 수 없다고 느낀다.',
    ],
  },
  {
    en: [
      'I do not feel like a failure.',
      'I feel I have failed more than the average person.',
      'As I look back on my life, all I can see is a lot of failures.',
      'I feel I am a complete failure as a person.',
    ],
    ko: [
      '나는 나를 실패자라고 느끼지 않는다.',
      '나는 보통 사람보다 더 많이 실패했다고 느낀다.',
      '내 삶을 돌이켜보면 실패뿐인 것 같다.',
      '나는 내가 인간으로서 완전한 실패자라고 느낀다.',
    ],
  },
  {
    en: [
      'I get as much satisfaction out of things as I used to.',
      "I don't enjoy things the way I used to.",
      "I don't get real satisfaction out of anything anymore.",
      'I am dissatisfied or bored with everything.',
    ],
    ko: [
      '나는 예전만큼 일상에서 만족을 느낀다.',
      '나는 예전만큼 즐겁지 않다.',
      '나는 더 이상 어떤 것에서도 진정한 만족을 얻지 못한다.',
      '나는 모든 것에 불만스럽거나 지루하다.',
    ],
  },
  {
    en: [
      "I don't feel particularly guilty.",
      'I feel guilty a good part of the time.',
      'I feel quite guilty most of the time.',
      'I feel guilty all of the time.',
    ],
    ko: [
      '나는 특별히 죄책감을 느끼지 않는다.',
      '나는 상당한 시간 동안 죄책감을 느낀다.',
      '나는 대부분의 시간 동안 꽤 죄책감을 느낀다.',
      '나는 항상 죄책감을 느낀다.',
    ],
  },
  {
    en: [
      "I don't feel I am being punished.",
      'I feel I may be punished.',
      'I expect to be punished.',
      'I feel I am being punished.',
    ],
    ko: [
      '나는 벌을 받고 있다고 느끼지 않는다.',
      '나는 벌을 받을지도 모른다고 느낀다.',
      '나는 벌을 받을 것이라고 예상한다.',
      '나는 벌을 받고 있다고 느낀다.',
    ],
  },
  {
    en: [
      "I don't feel disappointed in myself.",
      'I am disappointed in myself.',
      'I am disgusted with myself.',
      'I hate myself.',
    ],
    ko: [
      '나는 나 자신에게 실망하지 않는다.',
      '나는 나 자신에게 실망한다.',
      '나는 나 자신에게 혐오감을 느낀다.',
      '나는 나 자신을 증오한다.',
    ],
  },
  {
    en: [
      "I don't feel I am any worse than anybody else.",
      'I am critical of myself for my weaknesses or mistakes.',
      'I blame myself all the time for my faults.',
      'I blame myself for everything bad that happens.',
    ],
    ko: [
      '나는 내가 다른 사람보다 못하다고 느끼지 않는다.',
      '나는 나의 약점이나 실수에 대해 나 자신을 비판한다.',
      '나는 나의 잘못에 대해 항상 나 자신을 탓한다.',
      '나는 일어나는 모든 나쁜 일을 내 탓으로 돌린다.',
    ],
  },
  {
    en: [
      "I don't have any thoughts of killing myself.",
      'I have thoughts of killing myself, but I would not carry them out.',
      'I would like to kill myself.',
      'I would kill myself if I had the chance.',
    ],
    ko: [
      '나는 자살에 대한 생각이 전혀 없다.',
      '나는 자살을 생각하지만 실행하지는 않을 것이다.',
      '나는 자살하고 싶다.',
      '기회가 있다면 나는 자살할 것이다.',
    ],
  },
  {
    en: [
      "I don't cry any more than usual.",
      'I cry more now than I used to.',
      'I cry all the time now.',
      "I used to be able to cry, but now I can't cry even though I want to.",
    ],
    ko: [
      '나는 평소보다 더 울지는 않는다.',
      '나는 예전보다 더 많이 운다.',
      '나는 요즘 항상 운다.',
      '나는 예전에는 울 수 있었지만 이제는 울고 싶어도 울 수 없다.',
    ],
  },
  {
    en: [
      'I am no more irritated by things than I ever was.',
      'I am slightly more irritated now than usual.',
      'I am quite annoyed or irritated a good deal of the time.',
      'I feel irritated all the time.',
    ],
    ko: [
      '나는 예전보다 더 짜증을 내지는 않는다.',
      '나는 평소보다 약간 더 짜증이 난다.',
      '나는 상당한 시간 동안 꽤 신경질이 나거나 짜증이 난다.',
      '나는 항상 짜증이 난다.',
    ],
  },
  {
    en: [
      'I have not lost interest in other people.',
      'I am less interested in other people than I used to be.',
      'I have lost most of my interest in other people.',
      'I have lost all of my interest in other people.',
    ],
    ko: [
      '나는 다른 사람에 대한 관심을 잃지 않았다.',
      '나는 예전보다 다른 사람에게 관심이 줄었다.',
      '나는 다른 사람에 대한 관심을 대부분 잃었다.',
      '나는 다른 사람에 대한 관심을 완전히 잃었다.',
    ],
  },
  {
    en: [
      'I make decisions about as well as I ever could.',
      'I put off making decisions more than I used to.',
      'I have greater difficulty in making decisions more than I used to.',
      "I can't make decisions at all anymore.",
    ],
    ko: [
      '나는 예전만큼 잘 결정을 내린다.',
      '나는 예전보다 결정을 더 미룬다.',
      '나는 예전보다 결정을 내리기가 훨씬 더 어렵다.',
      '나는 더 이상 어떤 결정도 내릴 수 없다.',
    ],
  },
  {
    en: [
      "I don't feel that I look any worse than I used to.",
      'I am worried that I am looking old or unattractive.',
      'I feel there are permanent changes in my appearance that make me look unattractive.',
      'I believe that I look ugly.',
    ],
    ko: [
      '나는 예전보다 내 모습이 더 나빠 보인다고 느끼지 않는다.',
      '나는 늙어 보이거나 매력 없어 보일까 봐 걱정한다.',
      '나는 외모에 영구적인 변화가 생겨 매력 없어 보인다고 느낀다.',
      '나는 내가 못생겨 보인다고 믿는다.',
    ],
  },
  {
    en: [
      'I can work about as well as before.',
      'It takes an extra effort to get started at doing something.',
      'I have to push myself very hard to do anything.',
      "I can't do any work at all.",
    ],
    ko: [
      '나는 예전만큼 일을 잘 할 수 있다.',
      '나는 무언가를 시작하려면 별도의 노력이 든다.',
      '나는 무엇이든 하려면 나 자신을 매우 다그쳐야 한다.',
      '나는 어떤 일도 전혀 할 수 없다.',
    ],
  },
  {
    en: [
      'I can sleep as well as usual.',
      "I don't sleep as well as I used to.",
      'I wake up 1-2 hours earlier than usual and find it hard to get back to sleep.',
      'I wake up several hours earlier than I used to and cannot get back to sleep.',
    ],
    ko: [
      '나는 평소만큼 잘 잔다.',
      '나는 예전만큼 잘 자지 못한다.',
      '나는 평소보다 1~2시간 일찍 깨고 다시 잠들기 어렵다.',
      '나는 예전보다 몇 시간 일찍 깨고 다시 잠들 수 없다.',
    ],
  },
  {
    en: [
      "I don't get more tired than usual.",
      'I get tired more easily than I used to.',
      'I get tired from doing almost anything.',
      'I am too tired to do anything.',
    ],
    ko: [
      '나는 평소보다 더 피곤하지 않다.',
      '나는 예전보다 더 쉽게 피곤해진다.',
      '나는 거의 무엇을 하든 피곤해진다.',
      '나는 너무 피곤해서 아무것도 할 수 없다.',
    ],
  },
  {
    en: [
      'My appetite is no worse than usual.',
      'My appetite is not as good as it used to be.',
      'My appetite is much worse now.',
      'I have no appetite at all anymore.',
    ],
    ko: [
      '나의 식욕은 평소보다 나쁘지 않다.',
      '나의 식욕은 예전만큼 좋지 않다.',
      '나의 식욕은 이제 훨씬 더 나빠졌다.',
      '나는 이제 전혀 식욕이 없다.',
    ],
  },
  {
    en: [
      "I haven't lost much weight, if any, lately.",
      'I have lost more than five pounds.',
      'I have lost more than ten pounds.',
      'I have lost more than fifteen pounds.',
    ],
    ko: [
      '나는 최근에 체중이 거의 줄지 않았다.',
      '나는 체중이 2kg 이상 줄었다.',
      '나는 체중이 5kg 이상 줄었다.',
      '나는 체중이 7kg 이상 줄었다.',
    ],
  },
  {
    en: [
      'I am no more worried about my health than usual.',
      'I am worried about physical problems like aches, pains, upset stomach, or constipation.',
      "I am very worried about physical problems and it's hard to think of much else.",
      'I am so worried about my physical problems that I cannot think of anything else.',
    ],
    ko: [
      '나는 평소보다 건강에 대해 더 걱정하지 않는다.',
      '나는 쑤심, 통증, 속 쓰림, 변비 같은 신체 문제에 대해 걱정한다.',
      '나는 신체 문제에 대해 매우 걱정되어 다른 것을 생각하기 어렵다.',
      '나는 신체 문제에 너무 걱정되어 다른 어떤 것도 생각할 수 없다.',
    ],
  },
  {
    en: [
      'I have not noticed any recent change in my interest in sex.',
      'I am less interested in sex than I used to be.',
      'I have almost no interest in sex.',
      'I have lost interest in sex completely.',
    ],
    ko: [
      '나는 최근 성에 대한 관심에 변화를 느끼지 못했다.',
      '나는 예전보다 성에 대한 관심이 줄었다.',
      '나는 성에 대한 관심이 거의 없다.',
      '나는 성에 대한 관심을 완전히 잃었다.',
    ],
  },
]
